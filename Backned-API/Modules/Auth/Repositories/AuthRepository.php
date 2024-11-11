<?php

namespace Modules\Auth\Repositories;

use App\Abstracts\EntityRepository;
use App\Helpers\NumbersHelper;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\PersonalAccessTokenResult;
use Modules\Hrm\Entities\Employee;
use Symfony\Component\HttpFoundation\Response;

class AuthRepository extends EntityRepository
{
    protected string $table = 'employees';

    public function __construct(private ?Employee $employee)
    {
        $this->employee = null;
        // $this->otpSms = $otpSms;
    }

    /**
     * @throws Exception
     */
    public function login(array $data): array
    {
        $this->employee = Employee::where('email', $data['email'])->first();

        if (empty($this->employee)) {
            throw new Exception(__('Sorry, No user found by this email address. Please try with correct credential.'), Response::HTTP_NOT_FOUND);
        }

        if (!$this->isValidPassword($this->employee->password, $data['password'])) {
            throw new Exception(__('Sorry, Email and password does not match.'), Response::HTTP_UNAUTHORIZED);
        }

        $loginData = $this->getAuthData($this->employee, $this->createAuthToken($this->employee));

        activity()
            ->causedBy($this->employee)
            ->performedOn($this->employee)
            ->log('logged in');

        return $loginData;
    }


    public function isValidPassword(string $hashedPassword, string $givenPassword): bool
    {
        return Hash::check($givenPassword, $hashedPassword);
    }

    public function getAuthData(Employee $employee, PersonalAccessTokenResult $tokenInstance): array
    {
        return [
            'user' => $employee,
            'permissions' => $employee->getAllPermissionsByUser(),
            'access_token' => $tokenInstance->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($tokenInstance->token->expires_at)->toDateTimeString()
        ];
    }

    /**
     * @throws Exception
     */
    public function createAuthToken(Employee $employeeEntity): PersonalAccessTokenResult
    {
        try {
            return $employeeEntity->createToken('authToken');
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getAuthUserProfileData(): Authenticatable
    {
        return Auth::guard()->user();
    }

    /**
     * @throws Exception
     */
    public function logoutUserData(): void
    {
        Auth::guard()->user()->token()->revoke();
        Auth::guard()->user()->token()->delete();
    }

    protected function getExceptionMessages(): array
    {
        $exceptionMessages = parent::getExceptionMessages();

        $proposalExceptionMessages = [
            static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE => __('Login user does not found.'),
        ];

        return array_merge($exceptionMessages, $proposalExceptionMessages);
    }
}
