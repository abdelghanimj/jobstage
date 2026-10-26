<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['sometimes', 'in:candidate,company'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'candidate',
        ]);

        $token = $user->createToken('jobstage-token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }


public function login(Request $request)
{
    $validated = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    if (! Auth::attempt($validated)) {
        return response()->json([
            'message' => 'Email ou mot de passe incorrect.',
        ], 401);
    }

    $request->session()->regenerate();

    return response()->json([
        'message' => 'Connexion réussie.',
        'user' => $request->user(),
    ]);
}


    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }


public function logout(Request $request)
{
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json([
        'message' => 'Déconnexion réussie.',
    ]);
}

}
