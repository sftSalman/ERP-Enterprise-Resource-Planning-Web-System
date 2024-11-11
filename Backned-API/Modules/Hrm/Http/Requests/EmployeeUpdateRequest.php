<?php

namespace Modules\Hrm\Http\Requests;

use App\Http\Requests\ApiFormRequest;

class EmployeeUpdateRequest extends ApiFormRequest
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
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|max:100|unique:employees,email,' . $this->id,
            'code' => 'required|string|max:100|unique:employees,code,' . $this->id,
            'phone' => 'required|string|max:15|unique:employees,phone,' . $this->id
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => __('Please give your first name.'),
            'last_name.required' => __('Please give your last name.'),
            'email.required' => __('Please give your valid email.'),
            'code.required' => __('Please give your code.'),
            'code.unique' => __('Please give a unique code.'),
            'phone.required' => __('Please give your phone.'),
        ];
    }
}
