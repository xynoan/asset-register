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
            'purchase_date' => ['required', 'date', 'before_or_equal:today'],
            'vendor_supplier' => ['nullable', 'string', 'max:255'],
            'warranty_expiry_date' => ['nullable', 'date', 'after:purchase_date'],
            'status' => ['required', 'in:In-use,Spare,Under Maintenance,Retired'],
            'maintenance_history' => ['nullable', 'array'],
            'maintenance_history.*.date' => ['nullable', 'date'],
            'maintenance_history.*.description' => ['nullable', 'string', 'max:1000'],
            'maintenance_history.*.cost' => ['nullable', 'regex:/^-?\d+$/'],
            'maintenance_history.*.performed_by' => ['nullable', 'exists:tbl_employees,id'],
            'comments_history' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
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
                // Normalize the data before validation
                $normalized = [];
                foreach ($maintenanceHistory as $entry) {
                    // Convert empty strings to null for nullable fields
                    $normalizedEntry = [];
                    $normalizedEntry['date'] = isset($entry['date']) && $entry['date'] !== '' ? $entry['date'] : null;
                    $normalizedEntry['description'] = isset($entry['description']) && $entry['description'] !== '' ? $entry['description'] : null;
                    $normalizedEntry['cost'] = isset($entry['cost']) && $entry['cost'] !== '' ? $entry['cost'] : null;
                    $normalizedEntry['performed_by'] = isset($entry['performed_by']) && $entry['performed_by'] !== '' ? $entry['performed_by'] : null;
                    
                    // Only add entry if at least one field has a value
                    if (!empty(array_filter($normalizedEntry, function($value) {
                        return $value !== null && $value !== '';
                    }))) {
                        $normalized[] = $normalizedEntry;
                    }
                }
                
                // Merge normalized array back for validation
                if (!empty($normalized)) {
                    $this->merge(['maintenance_history' => array_values($normalized)]);
                } else {
                    $this->merge(['maintenance_history' => null]);
                }
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
     * Handle a passed validation attempt.
     * Convert validated array data to JSON strings for storage.
     */
    protected function passedValidation(): void
    {
        // Convert maintenance_history array to JSON string after validation
        if ($this->has('maintenance_history') && is_array($this->maintenance_history)) {
            $maintenanceHistory = $this->maintenance_history;
            $this->merge([
                'maintenance_history' => !empty($maintenanceHistory) 
                    ? json_encode(array_values($maintenanceHistory)) 
                    : null
            ]);
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
            'maintenance_history.*.cost' => 'maintenance cost',
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
