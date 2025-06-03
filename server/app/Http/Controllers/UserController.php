<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
        $search = $request->query('search') ?? "";

        $all_accounts = User::where('status', '!=', 'deleted')
        // ->where('employer_name', 'like', "%$search%")
        ->orderBy('created_at', 'desc')->simplePaginate($limit ?? 10);
        return response()->json(['accounts' => $all_accounts], 200);
    }
    public function account_stats (Request $request) {
        $type = $request->query('type');

        $stats = [];
        if($type === "total_accounts") {
            $stats = User::count();
        }
    return response()->json(['stats' => $stats], 200);
    }
}
