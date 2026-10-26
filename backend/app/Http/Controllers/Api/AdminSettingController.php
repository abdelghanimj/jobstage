<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    /**
     * Vérifier que l'utilisateur est administrateur.
     */
    private function isAdmin(Request $request): bool
    {
        return $request->user()
            && $request->user()->role === 'admin';
    }

    /**
     * Récupérer les paramètres de la plateforme.
     */
    public function show(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        $settings = Setting::firstOrCreate(
            ['id' => 1],
            [
                'platform_name' => 'JobStage',
                'language' => 'fr',
                'description' => 'Plateforme de gestion des offres de stage et d’emploi.',
                'notifications_enabled' => true,
                'maintenance_mode' => false,
            ]
        );

        return response()->json([
            'settings' => $settings,
        ]);
    }

    /**
     * Enregistrer les paramètres de la plateforme.
     */
    public function update(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        $validated = $request->validate([
            'platform_name' => ['required', 'string', 'max:255'],
            'language' => ['required', 'in:fr,ar,en'],
            'description' => ['nullable', 'string', 'max:2000'],
            'notifications_enabled' => ['required', 'boolean'],
            'maintenance_mode' => ['required', 'boolean'],
        ]);

        $settings = Setting::firstOrCreate(['id' => 1]);
        $settings->fill($validated);
        $settings->save();

        return response()->json([
            'message' => 'Paramètres enregistrés avec succès.',
            'settings' => $settings,
        ]);
    }
}

