<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CandidateProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'message' => 'Accès réservé aux candidats.',
            ], 403);
        }

        $profile = CandidateProfile::firstOrCreate([
            'user_id' => $user->id,
        ]);

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'message' => 'Accès réservé aux candidats.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'city' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
        ]);

        DB::transaction(function () use ($user, $validated) {
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->save();

            $profile = CandidateProfile::firstOrCreate([
                'user_id' => $user->id,
            ]);

            $profile->fill([
                'phone' => $validated['phone'] ?? null,
                'city' => $validated['city'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'linkedin_url' => $validated['linkedin_url'] ?? null,
                'github_url' => $validated['github_url'] ?? null,
            ]);
            $profile->save();
        });

        return response()->json([
            'message' => 'Votre profil a été mis à jour avec succès.',
            'user' => $user->fresh(),
            'profile' => CandidateProfile::where('user_id', $user->id)->first(),
        ]);
    }

    public function uploadCv(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'message' => 'Accès réservé aux candidats.',
            ], 403);
        }

        $validated = $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $profile = CandidateProfile::firstOrCreate([
            'user_id' => $user->id,
        ]);

        $oldCv = $profile->cv_path;
        $path = $request->file('cv')->store('cvs', 'local');

        $profile->cv_path = $path;
        $profile->save();

        if ($oldCv) {
            Storage::disk('local')->delete($oldCv);
        }

        return response()->json([
            'message' => 'CV importé avec succès.',
            'cv_path' => $profile->cv_path,
        ]);
    }
}
