<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

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
            'model_number' => ['required', 'integer'],
            'serial_number' => ['required', 'integer'],
            'purchase_date' => ['required', 'date'],
            'vendor_supplier' => ['nullable', 'string', 'max:255'],
            'warranty_expiry_date' => ['nullable', 'date', 'after:purchase_date'],
            'status' => ['required', 'in:In-use,Spare,Under Maintenance,Retired'],
            'maintenance_history' => ['nullable', 'string'],
            'comments_history' => ['nullable', 'string'],
            'notes' => ['nullable', 'array'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png,txt'],
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

        // Handle maintenance_history: convert array to JSON string or null
        if ($this->has('maintenance_history')) {
            $maintenanceHistory = $this->maintenance_history;
            if (is_array($maintenanceHistory)) {
                // Filter out empty entries (where all fields are empty)
                $filtered = array_filter($maintenanceHistory, function($entry) {
                    return !empty(array_filter($entry));
                });
                
                $this->merge([
                    'maintenance_history' => !empty($filtered) 
                        ? json_encode(array_values($filtered)) 
                        : null
                ]);
            } elseif ($maintenanceHistory === '') {
                $this->merge(['maintenance_history' => null]);
            }
        }

        // Handle comments_history: convert array to JSON string or null
        if ($this->has('comments_history')) {
            $commentsHistory = $this->comments_history;
            if (is_array($commentsHistory)) {
                // Filter out empty entries (where all fields are empty)
                $filtered = array_filter($commentsHistory, function($entry) {
                    return !empty(array_filter($entry));
                });
                
                $this->merge([
                    'comments_history' => !empty($filtered) 
                        ? json_encode(array_values($filtered)) 
                        : null
                ]);
            } elseif ($commentsHistory === '') {
                $this->merge(['comments_history' => null]);
            }
        }

        // Handle notes: convert array to JSON string or null
        if ($this->has('notes')) {
            $notes = $this->notes;
            if (is_array($notes)) {
                // Filter out empty entries (where all fields are empty)
                $filtered = array_filter($notes, function($entry) {
                    return !empty(array_filter($entry));
                });
                
                $this->merge([
                    'notes' => !empty($filtered) 
                        ? json_encode(array_values($filtered)) 
                        : null
                ]);
            } elseif ($notes === '') {
                $this->merge(['notes' => null]);
            }
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
    protected function failedValidation(Validator $validator)
    {
        if ($this->expectsJson() || $this->is('api/*')) {
            throw new HttpResponseException(
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
