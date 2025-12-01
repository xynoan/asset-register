<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\BrandManufacturer;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class LookupController extends Controller
{
    /**
     * Display the lookup management page.
     */
    public function index(): Response
    {
        // Get all lookups with usage counts
        $categories = AssetCategory::orderBy('name')->get()->map(function ($category) {
            $usageCount = Asset::where('asset_category', $category->name)->count();
            return [
                'id' => $category->id,
                'name' => $category->name,
                'usage_count' => $usageCount,
            ];
        });

        $brands = BrandManufacturer::orderBy('name')->get()->map(function ($brand) {
            $usageCount = Asset::where('brand_manufacturer', $brand->name)->count();
            return [
                'id' => $brand->id,
                'name' => $brand->name,
                'usage_count' => $usageCount,
            ];
        });

        $suppliers = Supplier::orderBy('name')->get()->map(function ($supplier) {
            $usageCount = Asset::where('vendor_supplier', $supplier->name)->count();
            return [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'usage_count' => $usageCount,
            ];
        });

        return Inertia::render('Lookups/Index', [
            'categories' => $categories,
            'brands' => $brands,
            'suppliers' => $suppliers,
        ]);
    }
    /**
     * Get all asset categories.
     */
    public function categories(): JsonResponse
    {
        $categories = AssetCategory::orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get all brands/manufacturers.
     */
    public function brands(): JsonResponse
    {
        $brands = BrandManufacturer::orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    /**
     * Get all suppliers.
     */
    public function suppliers(): JsonResponse
    {
        $suppliers = Supplier::orderBy('name')
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
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:asset_categories,name'
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $category = AssetCategory::create([
            'name' => $request->name
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
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:brands_manufacturers,name'
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $brand = BrandManufacturer::create([
            'name' => $request->name
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
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:suppliers,name'
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $supplier = Supplier::create([
            'name' => $request->name
        ]);

        return response()->json([
            'success' => true,
            'data' => $supplier,
            'message' => 'Supplier created successfully'
        ], 201);
    }

    /**
     * Delete an asset category (hard delete).
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

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    /**
     * Delete a brand/manufacturer (hard delete).
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

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully'
        ]);
    }

    /**
     * Delete a supplier (hard delete).
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

        $supplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully'
        ]);
    }

    /**
     * Update an asset category.
     */
    public function updateCategory(Request $request, $id): JsonResponse
    {
        $category = AssetCategory::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:asset_categories,name,' . $id
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $oldName = $category->name;
        $category->update(['name' => $request->name]);

        // Update all assets using this category
        Asset::where('asset_category', $oldName)->update(['asset_category' => $request->name]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category updated successfully'
        ]);
    }

    /**
     * Update a brand/manufacturer.
     */
    public function updateBrand(Request $request, $id): JsonResponse
    {
        $brand = BrandManufacturer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:brands_manufacturers,name,' . $id
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $oldName = $brand->name;
        $brand->update(['name' => $request->name]);

        // Update all assets using this brand
        Asset::where('brand_manufacturer', $oldName)->update(['brand_manufacturer' => $request->name]);

        return response()->json([
            'success' => true,
            'data' => $brand,
            'message' => 'Brand updated successfully'
        ]);
    }

    /**
     * Update a supplier.
     */
    public function updateSupplier(Request $request, $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:suppliers,name,' . $id
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $oldName = $supplier->name;
        $supplier->update(['name' => $request->name]);

        // Update all assets using this supplier
        Asset::where('vendor_supplier', $oldName)->update(['vendor_supplier' => $request->name]);

        return response()->json([
            'success' => true,
            'data' => $supplier,
            'message' => 'Supplier updated successfully'
        ]);
    }
}
