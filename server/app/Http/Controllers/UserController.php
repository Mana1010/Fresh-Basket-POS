<?php

namespace App\Http\Controllers;

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
}
