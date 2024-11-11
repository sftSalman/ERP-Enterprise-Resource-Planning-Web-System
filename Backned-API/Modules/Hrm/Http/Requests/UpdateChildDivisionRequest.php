<?php

namespace Modules\Hrm\Http\Requests;

use App\Http\Requests\ApiFormRequest;

class UpdateChildDivisionRequest extends ApiFormRequest
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
            'name' => 'required|max:100' . $this->id,
            'code' => 'required|max:100' . $this->id,
            'sub_division_id' => 'required|max:100' . $this->id,
        ];
    }
}
