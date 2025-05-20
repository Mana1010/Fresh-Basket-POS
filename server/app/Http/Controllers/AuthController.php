<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login (Request $request) {
        $type = $request->query('type');
        $token = ''; //This is where the session token store;
        $user_role = '';
        if($type === "credential-based") {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255'
        ]);
        $user = User::where('username', $validated["username"])->first();
        if(!$user || Hash::check($validated["password"], $user->password)) {
            return response()->json(['message' => 'Wrong credentials'], 401);
        }
           $user_role = $user->role;
           $token =  $user->createToken('session_token')->plainTextToken;

        }

        else if ($type === "passcode-based") {
         $validated = $request->validate([
            'passcode' => 'required|string|max:6',
        ]);
            $user = User::where('passcode', $validated['passcode'])->first();
            if(!$user) {
                return response()->json(['message' => 'Invalid passcode'], 401);
            }
              $user_role = $user->role;
            $token = $user->createToken('session_token')->plainTextToken;
        }

           return response()->json(['message' => 'Successfully logged in', 'token' => $token, 'role' => $user_role]);
    }

    public function user (Request $request) {
        $user = $request->user();

        if(!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        };

       $data = [
            'id' => $user->id,
            'role' => $user->role,
            'username' => $user->username,
        ];
        return response()->json(['user' => $data], 200);
    }
}
