<?php

use App\Enum\Status;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id()->from(101);
            $table->string('first_name')->nullable();
            $table->string('code')->unique();
            $table->string('last_name')->nullable();
            $table->string('surname')->nullable();
            $table->string('username')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->unique()->nullable();
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->unsignedBigInteger('designation_id')->nullable();
            $table->unsignedBigInteger('division_id')->nullable();
            $table->unsignedBigInteger('sub_division_id')->nullable();
            $table->unsignedBigInteger('child_division_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('status')->default(Status::PENDING)->index();
            $table->boolean('is_head_office')->default(true);
            $table->integer('level');
            $table->rememberToken();
            $table->unsignedBigInteger('created_by')->index();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
