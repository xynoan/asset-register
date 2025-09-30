<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     */
    public function index(Request $request)
    {
        $employees = Employee::with(['creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => $employees,
                'message' => 'Employees retrieved successfully'
            ]);
        }

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create(): Response
    {
        return Inertia::render('Employees/Create');
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $employeeNo = $this->generateEmployeeNumber();

        $fullName = trim($validated['first_name'] . ' ' . $validated['last_name']);

        Employee::create([
            'employee_no' => $employeeNo,
            'full_name' => $fullName,
            'birth_date' => $validated['birth_date'],
            'status' => 'active',
            'created_by' => Auth::id() ?? 1,
            'updated_by' => Auth::id() ?? 1,
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully!');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): Response
    {
        $employee->load(['creator', 'updater']);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee): Response
    {
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $validated = $request->validated();

        $fullName = trim($validated['first_name'] . ' ' . $validated['last_name']);

        $employee->update([
            'full_name' => $fullName,
            'birth_date' => $validated['birth_date'],
            'updated_by' => Auth::id() ?? 1,
        ]);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Employee updated successfully!',
                'data' => $employee->load(['creator', 'updater'])
            ]);
        }

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee updated successfully!');
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Request $request, Employee $employee)
    {
        $employee->delete();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully!'
            ]);
        }

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully!');
    }

    /**
     * Generate a unique employee number.
     */
    private function generateEmployeeNumber(): string
    {
        $prefix = 'EMP';
        $year = date('Y');

        $lastEmployee = Employee::where('employee_no', 'like', $prefix . $year . '%')
            ->orderBy('employee_no', 'desc')
            ->first();

        if ($lastEmployee) {
            $lastSequence = (int) substr($lastEmployee->employee_no, -4);
            $newSequence = $lastSequence + 1;
        } else {
            $newSequence = 1;
        }

        return $prefix . $year . str_pad($newSequence, 4, '0', STR_PAD_LEFT);
    }
}
