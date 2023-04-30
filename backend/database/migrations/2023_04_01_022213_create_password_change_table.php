<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePasswordChangeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('password_change', function (Blueprint $table) {
            $table->id();
            $table->string('password_id')->unique();
            $table->string('user_id');
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->string('password');
            $table->timestamp('change_date')->nullable();
            $table->string('reset_token')->nullable();
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
        Schema::dropIfExists('password_resets');
    }
}
