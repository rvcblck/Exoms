<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('topic_id')->unique();
            $table->string('program_id');
            $table->foreign('program_id')->references('program_id')->on('programs');
            $table->string('col_1')->nullable();
            $table->string('col_2')->nullable();
            $table->string('col_3')->nullable();
            $table->string('arrangement')->nullable();
            $table->boolean('archived')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('topics');
    }
};
