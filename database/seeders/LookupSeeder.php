<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use App\Models\BrandManufacturer;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class LookupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Asset Categories
        $categories = [
            'Keyboard',
            'Mouse',
            'Monitor',
            'Printer',
            'Scanner',
            'Headset',
            'Webcam',
            'Speakers',
            'Hard Drive',
            'SSD',
            'USB Drive',
            'Other'
        ];

        foreach ($categories as $category) {
            AssetCategory::firstOrCreate(
                ['name' => $category],
                ['is_active' => true]
            );
        }

        // Seed some common Brands/Manufacturers (users can add more)
        $brands = [
            'HP',
            'Dell',
            'Lenovo',
            'Logitech',
            'Microsoft',
            'Apple',
            'Samsung',
            'Canon',
            'Epson',
            'Other'
        ];

        foreach ($brands as $brand) {
            BrandManufacturer::firstOrCreate(
                ['name' => $brand],
                ['is_active' => true]
            );
        }

        // Seed some common Suppliers (users can add more)
        $suppliers = [
            'Amazon',
            'Office Depot',
            'Best Buy',
            'CDW',
            'Other'
        ];

        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(
                ['name' => $supplier],
                ['is_active' => true]
            );
        }
    }
}
