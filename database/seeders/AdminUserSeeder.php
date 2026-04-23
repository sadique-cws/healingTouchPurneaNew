<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'c'],
            [
                'name' => 'Hospital Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('123456789'), // You can change this
                'role' => 'admin',
                'phone' => '9999999999',
            ]
        );
    }
}
