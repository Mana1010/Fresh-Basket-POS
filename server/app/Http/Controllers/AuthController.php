<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function login (Request $request) {
        $type = $request->query('type');
        $token = ''; //This is where the session token store;
        $user_role = '';
        $user_details = [];

        if($type === "credential-based") {
        $validated = $request->validate([
            'username' => 'required|string|max:20',
            'password' => 'required|string|max:128'
        ]);
        $user = User::where('username', $validated["username"])->select('role', 'id', 'username')->first();
        if(!$user || Hash::check($validated["password"], $user->password)) {
            return response()->json(['message' => 'Wrong credentials'], 401);
        }
           $user_role = $user->role;
               $user_details = $user;
           $token =  $user->createToken('session_token')->plainTextToken;

        }

        else if ($type === "passcode-based") {
         $validated = $request->validate([
            'passcode' => 'required|string|max:6',
        ]);
            $user = User::where('passcode', $validated['passcode'])->select('role', 'id', 'username')->first();
            if(!$user) {
                return response()->json(['message' => 'Invalid passcode'], 401);
            }
              $user_role = $user->role;
              $user_details = $user;
            $token = $user->createToken('session_token')->plainTextToken;
        }

           return response()->json(['message' => 'Successfully logged in', 'token' => $token, 'role' => $user_role, 'user' => $user_details]);
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

    public function logout(Request $request) {

        $token = $request->bearerToken();
        try {

        if(!$token) {
            return response()->json(['message' => 'You are unauthorized to use this, please try logging in again'], 401);
        }

        PersonalAccessToken::findToken($token)->delete();

        return response()->json(['message' => 'Successfully logout'], 201);
        }
        catch(Exception $err) {
           return response()->json(['message' => 'Something went wrong, please try again'], 500);
        }
    }
}
