<?php

use App\Jobs\EvaluateRanksJob;
use App\Jobs\RunDailyBinaryPayoutJob;
use App\Jobs\RunWeeklyRoiJob;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schedule;

Artisan::command('aurum:reset-admin-password', function () {
    $admin = User::firstOrCreate(
        ['email' => 'admin@aurumnode.test'],
        [
            'name' => 'Admin User',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'sponsor_id' => null,
            'placement_side' => null,
            'status' => User::STATUS_FREE,
            'is_admin' => true,
            'is_blocked' => false,
        ]
    );
    $admin->update(['password' => Hash::make('password'), 'is_admin' => true, 'is_blocked' => false]);
    $this->info('Admin ready. Login: admin@aurumnode.test / password');
})->purpose('Reset admin login (admin@aurumnode.test / password)');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Binary bonus: weekly every Monday 00:05 server time (idempotent)
Schedule::command('payout:binary-daily')->weeklyOn(1, '00:05');

// Weekly ROI: every Monday 00:30 (idempotent)
Schedule::command('payout:roi-weekly')->weeklyOn(1, '00:30');

// Ranks evaluation
Schedule::call(fn () => EvaluateRanksJob::dispatch())->dailyAt('01:00')->timezone('Asia/Dubai');
