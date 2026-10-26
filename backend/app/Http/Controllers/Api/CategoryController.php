<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // Afficher toutes les catégories
    public function index()
    {
        return response()->json(
            Category::latest()->paginate(10)
        );
    }

    // Ajouter une catégorie
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['status'] = $validated['status'] ?? 'active';

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'category' => $category,
        ], 201);
    }

    // Modifier une catégorie
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:active,inactive',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Catégorie modifiée avec succès.',
            'category' => $category,
        ]);
    }

    // Supprimer une catégorie
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès.',
        ]);
    }
}
