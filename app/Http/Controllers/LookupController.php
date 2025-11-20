<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\BrandManufacturer;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LookupController extends Controller
{
    /**
     * Get all active asset categories.
     */
    public function categories(): JsonResponse
    {
        $categories = AssetCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get all active brands/manufacturers.
     */
    public function brands(): JsonResponse
    {
        $brands = BrandManufacturer::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    /**
     * Get all active suppliers.
     */
    public function suppliers(): JsonResponse
    {
        $suppliers = Supplier::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

    /**
     * Store a new asset category.
     */
    public function storeCategory(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:asset_categories,name,NULL,id,is_active,1']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $category = AssetCategory::create([
            'name' => $request->name,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category created successfully'
        ], 201);
    }

    /**
     * Store a new brand/manufacturer.
     */
    public function storeBrand(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:brands_manufacturers,name,NULL,id,is_active,1']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $brand = BrandManufacturer::create([
            'name' => $request->name,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'data' => $brand,
            'message' => 'Brand created successfully'
        ], 201);
    }

    /**
     * Store a new supplier.
     */
    public function storeSupplier(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:suppliers,name,NULL,id,is_active,1']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $supplier = Supplier::create([
            'name' => $request->name,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'data' => $supplier,
            'message' => 'Supplier created successfully'
        ], 201);
    }

    /**
     * Delete an asset category (soft delete by setting is_active to false).
     */
    public function deleteCategory($id): JsonResponse
    {
        $category = AssetCategory::findOrFail($id);

        // Check if category is in use
        $inUse = Asset::where('asset_category', $category->name)->exists();

        if ($inUse) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category that is in use by assets'
            ], 422);
        }

        $category->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    /**
     * Delete a brand/manufacturer (soft delete by setting is_active to false).
     */
    public function deleteBrand($id): JsonResponse
    {
        $brand = BrandManufacturer::findOrFail($id);

        // Check if brand is in use
        $inUse = Asset::where('brand_manufacturer', $brand->name)->exists();

        if ($inUse) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete brand that is in use by assets'
            ], 422);
        }

        $brand->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully'
        ]);
    }

    /**
     * Delete a supplier (soft delete by setting is_active to false).
     */
    public function deleteSupplier($id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        // Check if supplier is in use
        $inUse = Asset::where('vendor_supplier', $supplier->name)->exists();

        if ($inUse) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete supplier that is in use by assets'
            ], 422);
        }

        $supplier->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully'
        ]);
    }
}
