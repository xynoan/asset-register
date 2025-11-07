<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'asset_category' => ['required', 'string', 'max:255'],
            'brand_manufacturer' => ['required', 'string', 'max:255'],
            'model_number' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255'],
            'purchase_date' => ['required', 'date'],
            'vendor_supplier' => ['nullable', 'string', 'max:255'],
            'warranty_expiry_date' => ['nullable', 'date', 'after:purchase_date'],
            'status' => ['required', 'in:In-use,Spare,Under Maintenance,Retired'],
            'maintenance_history' => ['nullable', 'string'],
            'comments_history' => ['nullable', 'string'],
            'assigned_to' => ['nullable', 'sometimes', 'exists:tbl_employees,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null for nullable fields
        if ($this->has('assigned_to') && $this->assigned_to === '') {
            $this->merge(['assigned_to' => null]);
        }
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'asset_category' => 'asset category',
            'brand_manufacturer' => 'brand / manufacturer',
            'model_number' => 'model number',
            'serial_number' => 'serial number',
            'purchase_date' => 'purchase date',
            'vendor_supplier' => 'vendor / supplier',
            'warranty_expiry_date' => 'warranty expiry date',
            'assigned_to' => 'assigned to',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        if ($this->expectsJson() || $this->is('api/*')) {
            throw new \Illuminate\Http\Exceptions\HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422)
            );
        }

        parent::failedValidation($validator);
    }
}
