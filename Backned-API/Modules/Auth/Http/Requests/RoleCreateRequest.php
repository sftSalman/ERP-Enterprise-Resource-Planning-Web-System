<?php

namespace Modules\Auth\Http\Requests;

use App\Http\Requests\ApiFormRequest;

class RoleCreateRequest extends ApiFormRequest
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
            'role' => 'required',
            'sum_assured_limit' => 'required|numeric',
            'groupList' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => __('Please give a role name.'),
            'sum_assured_limit.required' => __('Please give sum assured limit.'),
            'groupList.required' => __('Please select a group lists.'),
        ];
    }
}
