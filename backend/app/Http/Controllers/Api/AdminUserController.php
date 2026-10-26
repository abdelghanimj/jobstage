<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * Afficher les candidats et les entreprises.
     */

public function index(Request $request)
{
    $admin = $request->user();

    if (!$admin || $admin->role !== 'admin') {
        return response()->json([
            'message' => 'Accès interdit.',
        ], 403);
    }

    $perPage = min(
        max((int) $request->query('per_page', 10), 1),
        100
    );

    $users = User::query()
        ->whereIn('role', ['candidate', 'company'])
        ->select('id', 'name', 'email', 'role', 'created_at')
        ->latest()
        ->paginate($perPage);

    return response()->json($users);
}

    /**
     * Modifier un candidat ou une entreprise.
     */
    public function update(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        // Ne jamais permettre la modification d'un compte admin.
        $user = User::query()
            ->whereIn('role', ['candidate', 'company'])
            ->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],
            'role' => ['required', 'in:candidate,company'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'message' => 'Utilisateur modifié avec succès.',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'created_at',
            ]),
        ]);
    }

    /**
     * Supprimer un candidat ou une entreprise.
     */
    public function destroy(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        $user = User::query()
            ->whereIn('role', ['candidate', 'company'])
            ->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé.',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }
}
