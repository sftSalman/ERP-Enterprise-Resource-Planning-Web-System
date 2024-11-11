<?php

namespace Modules\Hrm\Http\Requests;

use App\Http\Requests\ApiFormRequest;

class EmployeeStoreRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'required|string|max:100|unique:employees',
            'phone' => 'required|string|max:15|unique:employees',
            'password' => 'required|string|max:100|min:8',
            'role_id' => 'required|integer',
            // 'avatar' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => __('Please give your first name.'),
            'last_name.required' => __('Please give your last name.'),
            'email.required' => __('Please give your valid email.'),
            'password.required' => __('Please give your password.'),
            'phone.required' => __('Please give your phone.'),
            'role_id.required' => __('Please select a role.'),
        ];
    }
}
