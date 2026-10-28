<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    /**
     * Afficher les offres avec recherche et pagination.
     */
    public function index(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        $perPage = min(
            max((int) $request->query('per_page', 10), 1),
            100
        );

        $query = JobOffer::query();

        if ($request->filled('search')) {
            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if (
            $request->filled('status') &&
            in_array($request->query('status'), [
                'pending',
                'approved',
                'rejected',
            ])
        ) {
            $query->where('status', $request->query('status'));
        }

        return response()->json(
            $query->latest()->paginate($perPage)
        );
    }

    /**
     * Statistiques des offres.
     */
    public function stats(Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        return response()->json([
            'total' => JobOffer::count(),
            'pending' => JobOffer::where('status', 'pending')->count(),
            'approved' => JobOffer::where('status', 'approved')->count(),
            'rejected' => JobOffer::where('status', 'rejected')->count(),
        ]);
    }

    /**
     * Approuver ou refuser une offre.
     */
    public function updateStatus(Request $request, $id)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $offer = JobOffer::find($id);

        if (!$offer) {
            return response()->json([
                'message' => 'Offre introuvable.',
            ], 404);
        }

        $offer->status = $validated['status'];
        $offer->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'offer' => $offer,
        ]);
    }

    /**
     * Supprimer une offre.
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        $offer = JobOffer::find($id);

        if (!$offer) {
            return response()->json([
                'message' => 'Offre introuvable.',
            ], 404);
        }

        $offer->delete();

        return response()->json([
            'message' => 'Offre supprimée avec succès.',
        ]);
    }
    //public home page offers
    /**
 * Afficher les offres approuvées avec recherche et pagination.
 */
/**
 * Afficher les offres approuvées avec recherche et pagination.
 */
public function publicIndex(Request $request)
{
    $perPage = min(
        max((int) $request->query('per_page', 8), 1),
        24
    );

    $query = JobOffer::query()
        ->where('status', 'published');

    // Recherche par titre ou localisation
    if ($request->filled('q')) {
        $search = $request->query('q');

        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%");
        });
    }

    // Filtrage par ville ou localisation
    if ($request->filled('city')) {
        $city = $request->query('city');

        $query->where('location', 'like', "%{$city}%");
    }

    return response()->json(
        $query->latest()->paginate($perPage)
    );
}
public function publicShow($id)
{
    $offer = JobOffer::query()
        ->where('status', 'published')
        ->find($id);

    if (!$offer) {
        return response()->json([
            'message' => 'Offre introuvable.',
        ], 404);
    }

    return response()->json($offer);
}
}
