<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('settings', function (Blueprint $table) {
        $table->id();
        $table->string('platform_name')->default('JobStage');
        $table->string('language', 5)->default('fr');
        $table->text('description')->nullable();
        $table->boolean('notifications_enabled')->default(true);
        $table->boolean('maintenance_mode')->default(false);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('settings');
}

    /**
     * Reverse the migrations.
     */
   
};
