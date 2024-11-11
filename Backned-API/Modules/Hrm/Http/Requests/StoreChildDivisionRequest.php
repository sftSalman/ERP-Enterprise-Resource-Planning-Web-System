<?php

namespace Modules\Hrm\Http\Requests;

use App\Http\Requests\ApiFormRequest;

class StoreChildDivisionRequest extends ApiFormRequest
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
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'sub_division_id' => 'required|integer|max:255',
        ];
    }
}
