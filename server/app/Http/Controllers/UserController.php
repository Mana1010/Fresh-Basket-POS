<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function user_information (Request $request) {
        $type = $request->query('type');
        $user = $request->user();
        $user_info = [];
        if(!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }


        if($type === "basic") {
            $user_info = [
                'employer_name' => $user->employer_name,
                'role' => $user->role,
                'profile_picture' => $user->profile_picture,
            ];
        }
       return response()->json(['data' => $user_info], 200);
    }

    //Accounts Controller

    public function all_accounts (Request $request) {
        $limit = $request->query('limit');
        $search = $request->query('search');
        $sort = $request->query('sort');

        $all_accounts = User::where('status', '!=', 'deleted')
        ->where('employer_name', 'like', "%$search%")->orWhere('username', 'like', "%$search%");

    if($sort === "asc" || $sort === "desc") {
            $all_accounts->orderBy('employer_name', $sort);
        }
    else {
         $all_accounts->orderBy('created_at', 'desc');
        }

        $data = $all_accounts->simplePaginate($limit ?? 10);
        return response()->json(['accounts' => $data], 200);
    }
    public function account_stats (Request $request) {
        $type = $request->query('type');

        $stats = 0;
        if($type === "total_accounts") {
            $stats = User::count();
        }
        else if ($type === "total_accounts_blocked") {
            $stats = User::where('status', 'blocked')->count();
        }
        else if ($type === "total_active_accounts") {
        $stats = User::where('status', 'active')->count();
        }
    return response()->json(['stats' => $stats], 200);
    }

    public function add_account(Request $request) {

    try {
        $validated = $request->validate([
            'employer_name' => ['required', 'string', 'min:1', 'max:255', 'regex:/^[A-Z0-9\s.]+$/i'],
            'username' => ['required', 'string', 'min:5', 'max:20', 'regex:/^[A-Z0-9]+$/i'],
            'role' => ['required', 'string', 'in:admin,manager,cashier'],
            'password' => ['required', 'string', 'min:8', 'max:72', 'regex:/([!@#$%^&*()_+\-=\[\]{};\'":|,.<>\/?]){2,}/'],
            'password_confirmation' => ['required', 'string', 'same:password'],
            'passcode' => ['required', 'string', 'size:6'],
            'profile_picture' => ['string', 'nullable'],
        ]);

    $check_username = User::where('username', $validated['username'])->exists();
    $check_passcode = User::where('passcode', $validated['passcode'])->exists();

    if($check_username) {
        return response()->json(['message' => 'Username already taken', 'field' => 'username'], 409);
    }
    if ($check_passcode) {
        return response()->json(['message' => 'Passcode already taken', 'field' => 'passcode'], 409);
    }

    User::create([
        'employer_name' => $validated['employer_name'],
        'username' => $validated['username'],
        'role' => $validated['role'],
        'password' => bcrypt($validated['password']),
        'passcode' => $validated['passcode'],
        'profile_picture' => $validated['profile_picture'],
        'status' => 'active',
    ]);
    return response()->json(['message' => 'Account created successfully.'], 201);
    }
    catch(ValidationException $e) {
         return response()->json(['message' => $e->getMessage()], 422);
    }
    }
public function account_details($account_id) {
    $account_details = User::findOrFail($account_id);
    if(!$account_details) {
        return response()->json(['message', 'User not found'], 404);
    }
    return response()->json(['data' => $account_details], 200);
}
    public function edit_account(Request $request, $account_id) {
    try {


            $validated = $request->validate([
            'employer_name' => ['required', 'string', 'min:1', 'max:255', 'regex:/^[A-Z0-9\s.]+$/i'],
            'username' => ['required', 'string', 'min:5', 'max:20', 'regex:/^[A-Z0-9]+$/i'],
            'role' => ['required', 'string', 'in:admin,manager,cashier'],
            'password' => ['nullable', 'string', 'min:8', 'max:72', 'regex:/([!@#$%^&*()_+\-=\[\]{};\'":|,.<>\/?]){2,}/'],
            'password_confirmation' => ['nullable', 'string', 'same:password'],
            'passcode' => ['required', 'string', 'size:6'],
            'profile_picture' => ['string', 'nullable'],
        ]);

$validated['password'] = $validated['password'] ?? '';
$validated['password_confirmation'] = $validated['password_confirmation'] ?? '';

        $account = User::findOrFail($account_id);
        if(!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

     $check_username = User::where('username', $validated['username'])->where('id', "!=", $account_id)->exists(); //this check if the username (not the current one) already exist
    $check_passcode = User::where('passcode', $validated['passcode'])->where('id', "!=", $account_id)->exists(); //this check if the passcode (not the current one) already exist
     if($check_username) {
        return response()->json(['message' => 'Username already taken', 'field' => 'username'], 409);
    }
    if ($check_passcode) {
        return response()->json(['message' => 'Passcode already taken', 'field' => 'passcode'], 409);
    }
    $account->fill($validated);
        if($account->isDirty()) {
            $account->save();
        }
    $user_details = User::select('id', 'role', 'username')->find($account_id);
        return response()->json(['message' => 'Successfully updated the account', 'user_details' => $user_details], 201);
    }
    catch(ValidationException $err) {
        return response()->json(['message' => $err->getMessage()], 422);
    };
    }

    public function toggle_status_account($account_id) {
        $validated = request()->validate([
            'status' => ['required', 'string', 'in:active,blocked,inactive'],
        ]);

         $account = User::findOrFail($account_id);
           if(!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }
        $account->status = $validated['status'];
        $account->save();
        return response()->json(['message' => 'Account status updated successfully', 'status' => $account->status], 201);
    }

    public function cashier_metrics(Request $request) {
        $limit = $request->query('limit');
       $users = DB::table('users')
        ->select([
            'users.*',
            DB::raw('COALESCE(SUM(orders.total_price), 0) as total_sales'),
            DB::raw('COALESCE(SUM(orders.quantity), 0) as total_quantity'),
            DB::raw('COALESCE(SUM(invoice_ratings.rating), 0) as total_ratings')
        ])
        ->leftJoin('invoices', 'users.id', '=', 'invoices.user_id')
        ->leftJoin('orders', 'invoices.id', '=', 'orders.invoice_id')
        ->leftJoin('invoice_ratings', 'invoices.id', '=', 'invoice_ratings.invoice_id')
        ->where('users.role', 'cashier')
        ->groupBy('users.id')
        ->simplePaginate($limit ?? 10);
    return response()->json(['data' => $users], 200);
    }
}
