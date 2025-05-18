<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login (Request $request) {
        $type = $request->query('type');



        if($type === "credential-based") {

        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255'
        ]);
        }

        else if ($type === "passcode-based") {
         $validated = $request->validate([
            'passcode' => 'required|string|max:6',
        ]);
            $user = User::where('passcode', $validated['passcode'])->first();
            if(!$user) {
                return response()->json(['message' => 'Invalid passcode'], 401);
            }
            $token = $user->createToken('session_token')->plainTextToken;
            return response()->json(['message' => 'Successfully logged in', 'token' => $token]);
        }
    }
}
