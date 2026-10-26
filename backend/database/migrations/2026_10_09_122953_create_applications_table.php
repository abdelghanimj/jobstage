<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidate_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->foreignId('job_offer_id')
                  ->constrained('job_offers')
                  ->cascadeOnDelete();

            $table->string('cv_path')->nullable();
            $table->text('cover_letter')->nullable();

            $table->string('status')->default('pending');

            $table->timestamp('applied_at')->useCurrent();

            $table->timestamps();

            $table->unique(['candidate_id', 'job_offer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};

