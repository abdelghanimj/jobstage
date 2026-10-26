<?php
namespace Database\Seeders;
use App\Models\JobOffer;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $companies = User::where('role', 'company')->get();
        $categories = Category::all();

        if ($companies->isEmpty()) {
            $this->command->warn(
                'Aucun utilisateur avec le rôle company. Aucun offre ajouté.'
            );
            return;
        }

        if ($categories->isEmpty()) {
            $this->command->warn(
                'Aucune catégorie trouvée. Aucun offre ajouté.'
            );
            return;
        }

        $offers = [
            [
                'title' => 'Développeur Laravel Junior',
                'type' => 'CDI',
                'location' => 'Oujda',
                'description' => 'Nous recherchons un développeur junior pour participer au développement de nos applications web avec Laravel.',
                'requirements' => 'PHP, Laravel, MySQL, Git et bases en API REST.',
                'salary' => 5000,
                'status' => 'published',
                'days_until_deadline' => 30,
            ],
            [
                'title' => 'Développeur React Junior',
                'type' => 'Stage',
                'location' => 'Nador',
                'description' => 'Participation à la création d’interfaces web modernes et responsives.',
                'requirements' => 'JavaScript, React, HTML, CSS et Git.',
                'salary' => 2500,
                'status' => 'published',
                'days_until_deadline' => 20,
            ],
            [
                'title' => 'Développeur Full Stack',
                'type' => 'CDI',
                'location' => 'Rabat',
                'description' => 'Développement et maintenance d’applications web front-end et back-end.',
                'requirements' => 'PHP, Laravel, React, SQL et API REST.',
                'salary' => 6500,
                'status' => 'published',
                'days_until_deadline' => 25,
            ],
            [
                'title' => 'Développeur Next.js',
                'type' => 'Stage',
                'location' => 'Casablanca',
                'description' => 'Contribuer au développement d’une plateforme web avec Next.js.',
                'requirements' => 'JavaScript, React, Next.js et notions de Tailwind CSS.',
                'salary' => 3000,
                'status' => 'published',
                'days_until_deadline' => 15,
            ],
            [
                'title' => 'Développeur Mobile React Native',
                'type' => 'CDD',
                'location' => 'Tanger',
                'description' => 'Participer à la conception et au développement d’applications mobiles.',
                'requirements' => 'JavaScript, React Native et consommation d’API REST.',
                'salary' => 5500,
                'status' => 'published',
                'days_until_deadline' => 30,
            ],
        ];

        foreach ($offers as $index => $offerData) {
            $company = $companies[$index % $companies->count()];
            $category = $categories[$index % $categories->count()];

            unset($offerData['days_until_deadline']);

            JobOffer::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'title' => $offerData['title'],
                ],
                array_merge($offerData, [
                    'category_id' => $category->id,
                    'application_deadline' => now()->addDays(
                        $offers[$index]['days_until_deadline']
                    )->toDateString(),
                ])
            );
        }

        $this->command->info('Les offres ont été ajoutées avec succès.');
    }
}
