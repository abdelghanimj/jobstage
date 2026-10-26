<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'company_name' => 'TechMaroc',
                'website' => 'https://techmaroc.example.com',
                'industry' => 'Informatique',
                'city' => 'Oujda',
                'description' => 'Entreprise spécialisée dans le développement web et les solutions digitales.',
                'phone' => '0536000001',
                'address' => 'Centre-ville, Oujda',
            ],
            [
                'company_name' => 'Digital Solutions',
                'website' => 'https://digitalsolutions.example.com',
                'industry' => 'Développement Web',
                'city' => 'Nador',
                'description' => 'Développement d’applications web et mobiles pour les entreprises.',
                'phone' => '0536000002',
                'address' => 'Centre-ville, Nador',
            ],
            [
                'company_name' => 'Cloud Innov',
                'website' => 'https://cloudinnov.example.com',
                'industry' => 'Cloud Computing',
                'city' => 'Rabat',
                'description' => 'Solutions cloud, infrastructure informatique et services numériques.',
                'phone' => '0537000003',
                'address' => 'Agdal, Rabat',
            ],
            [
                'company_name' => 'Web Creative',
                'website' => 'https://webcreative.example.com',
                'industry' => 'Design et Développement',
                'city' => 'Casablanca',
                'description' => 'Création de sites web modernes et d’interfaces utilisateur.',
                'phone' => '0522000004',
                'address' => 'Maarif, Casablanca',
            ],
            [
                'company_name' => 'Mobile First',
                'website' => 'https://mobilefirst.example.com',
                'industry' => 'Applications Mobiles',
                'city' => 'Tanger',
                'description' => 'Conception et développement d’applications mobiles Android et iOS.',
                'phone' => '0539000005',
                'address' => 'Centre-ville, Tanger',
            ],
        ];

        foreach ($companies as $index => $companyData) {
            $user = User::where('role', 'company')
                ->orderBy('id')
                ->skip($index)
                ->first();

            if (!$user) {
                continue;
            }

            CompanyProfile::updateOrCreate(
                ['user_id' => $user->id],
                $companyData
            );
        }
    }
}
