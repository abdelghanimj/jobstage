<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class CompanyProfileController extends Controller
{
    /**
     * Afficher la liste des entreprises.
     */
    public function index()
    {
        $companies = CompanyProfile::with('user')
            ->latest()
            ->paginate(10);

        return response()->json($companies);
    }

    /**
     * Afficher une entreprise.
     */
    public function show(CompanyProfile $companyProfile)
    {
        $companyProfile->load('user');

        return response()->json($companyProfile);
    }

    /**
     * Créer le profil d'une entreprise.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'website' => ['nullable', 'url', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request
                ->file('logo')
                ->store('company-logos', 'public');
        }

        unset($validated['logo']);

        $company = CompanyProfile::create($validated);

        return response()->json([
            'message' => 'Entreprise créée avec succès.',
            'data' => $company,
        ], 201);
    }

    /**
     * Modifier une entreprise.
     */
    public function update(
        Request $request,
        CompanyProfile $companyProfile
    ) {
        // L'utilisateur ne peut modifier que son propre profil.
        if ($request->user()->id !== $companyProfile->user_id) {
            return response()->json([
                'message' => 'Vous n’êtes pas autorisé à modifier cette entreprise.',
            ], 403);
        }

        $validated = $request->validate([
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'website' => ['nullable', 'url', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('logo')) {
            if ($companyProfile->logo_path) {
                Storage::disk('public')->delete($companyProfile->logo_path);
            }

            $validated['logo_path'] = $request
                ->file('logo')
                ->store('company-logos', 'public');
        }

        unset($validated['logo']);

        $companyProfile->update($validated);

        return response()->json([
            'message' => 'Entreprise modifiée avec succès.',
            'data' => $companyProfile->fresh(),
        ]);
    }

    /**
     * Supprimer une entreprise.
     */
    public function destroy(
        Request $request,
        CompanyProfile $companyProfile
    ) {
        if ($request->user()->id !== $companyProfile->user_id) {
            return response()->json([
                'message' => 'Vous n’êtes pas autorisé à supprimer cette entreprise.',
            ], 403);
        }

        if ($companyProfile->logo_path) {
            Storage::disk('public')->delete($companyProfile->logo_path);
        }

        $companyProfile->delete();

        return response()->json([
            'message' => 'Entreprise supprimée avec succès.',
        ]);
    }
}
