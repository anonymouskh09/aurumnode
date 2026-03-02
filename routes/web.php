<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\PackageController;
use App\Http\Controllers\Dashboard\ProfileController;
use App\Http\Controllers\Dashboard\TeamController;
use App\Http\Controllers\Dashboard\WithdrawalController;
use App\Http\Controllers\Dashboard\TransferController;
use App\Http\Controllers\Dashboard\TransactionController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\KycController;
use App\Http\Controllers\Admin\WithdrawalController as AdminWithdrawalController;
use App\Http\Controllers\Dashboard\DirectBonusController;
use App\Http\Controllers\Dashboard\BinaryBonusController;
use App\Http\Controllers\Dashboard\BinaryTreeController;
use App\Http\Controllers\Dashboard\RoiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public landing pages (Inertia React)
Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/about', fn () => Inertia::render('About'))->name('about');
Route::get('/terms', fn () => Inertia::render('Terms'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('Privacy'))->name('privacy');
Route::get('/contact', fn () => Inertia::render('Contact'))->name('contact');

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.update');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Dashboard (authenticated, non-admin only - admin redirected to /admin)
Route::middleware(['auth', 'user.only'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', DashboardController::class)->name('index');
    Route::get('/packages', [PackageController::class, 'index'])->name('packages');
    Route::post('/packages/buy', [PackageController::class, 'buy'])->name('packages.buy');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/transaction-password', [ProfileController::class, 'transactionPassword'])->name('profile.transaction-password');
    Route::post('/profile/kyc', [ProfileController::class, 'kyc'])->name('profile.kyc');
    Route::get('/team', [TeamController::class, 'index'])->name('team');
    Route::get('/withdrawal', [WithdrawalController::class, 'index'])->name('withdrawal');
    Route::post('/withdrawal', [WithdrawalController::class, 'store'])->name('withdrawal.store');
    Route::get('/transfers', [TransferController::class, 'index'])->name('transfers');
    Route::post('/transfers/to-withdrawal', [TransferController::class, 'toWithdrawal'])->name('transfers.to-withdrawal');
    Route::post('/transfers/to-user', [TransferController::class, 'toUser'])->name('transfers.to-user');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions');
    Route::get('/binary-tree', [BinaryTreeController::class, 'index'])->name('binary-tree');
    Route::get('/direct-bonus', [DirectBonusController::class, 'index'])->name('direct-bonus');
    Route::get('/binary-bonus', [BinaryBonusController::class, 'index'])->name('binary-bonus');
    Route::get('/roi', [RoiController::class, 'index'])->name('roi');
    Route::get('/rank', [\App\Http\Controllers\Dashboard\RankController::class, 'index'])->name('rank');
});

// Admin
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('index');
    Route::get('/members', [\App\Http\Controllers\Admin\MembersController::class, 'index'])->name('members');
    Route::get('/members/{member}', [\App\Http\Controllers\Admin\MembersController::class, 'show'])->name('members.show');
    Route::put('/members/{member}', [\App\Http\Controllers\Admin\MembersController::class, 'update'])->name('members.update');
    Route::post('/members/{member}/reset-password', [\App\Http\Controllers\Admin\MembersController::class, 'resetPassword'])->name('members.reset-password');
    Route::post('/members/{member}/wallet-adjust', [\App\Http\Controllers\Admin\MembersController::class, 'walletAdjust'])->name('members.wallet-adjust');
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
    Route::get('/kyc', [KycController::class, 'index'])->name('kyc');
    Route::post('/kyc/{document}/approve', [KycController::class, 'approve'])->name('kyc.approve');
    Route::post('/kyc/{document}/reject', [KycController::class, 'reject'])->name('kyc.reject');
    Route::get('/withdrawals', [AdminWithdrawalController::class, 'index'])->name('withdrawals');
    Route::post('/withdrawals/{withdrawal}/approve', [AdminWithdrawalController::class, 'approve'])->name('withdrawals.approve');
    Route::post('/withdrawals/{withdrawal}/reject', [AdminWithdrawalController::class, 'reject'])->name('withdrawals.reject');
    // MLM 4X: Package management, user package controls, volume, ledger, payout runs, audit
    Route::get('/packages', [\App\Http\Controllers\Admin\PackagesController::class, 'index'])->name('packages.index');
    Route::get('/packages/{package}/edit', [\App\Http\Controllers\Admin\PackagesController::class, 'edit'])->name('packages.edit');
    Route::put('/packages/{package}', [\App\Http\Controllers\Admin\PackagesController::class, 'update'])->name('packages.update');
    Route::get('/user-package-controls', [\App\Http\Controllers\Admin\UserPackageControlsController::class, 'index'])->name('user-package-controls.index');
    Route::get('/user-package-controls/{member}', [\App\Http\Controllers\Admin\UserPackageControlsController::class, 'show'])->name('user-package-controls.show');
    Route::post('/user-package-controls/{member}/activate-access-package', [\App\Http\Controllers\Admin\UserPackageControlsController::class, 'activateAccessPackage'])->name('user-package-controls.activate-access');
    Route::put('/user-package-controls/user-package/{userPackage}', [\App\Http\Controllers\Admin\UserPackageControlsController::class, 'updateUserPackage'])->name('user-package-controls.update-package');
    Route::post('/user-package-controls/{member}/pause-earnings', [\App\Http\Controllers\Admin\UserPackageControlsController::class, 'pauseEarnings'])->name('user-package-controls.pause');
    Route::post('/user-package-controls/{member}/resume-earnings', [\App\Http\Controllers\Admin\UserPackageControlsController::class, 'resumeEarnings'])->name('user-package-controls.resume');
    Route::get('/volume', [\App\Http\Controllers\Admin\VolumeController::class, 'index'])->name('volume.index');
    Route::post('/volume/add', [\App\Http\Controllers\Admin\VolumeController::class, 'add'])->name('volume.add');
    Route::get('/earnings-ledger', [\App\Http\Controllers\Admin\EarningsLedgerController::class, 'index'])->name('earnings-ledger.index');
    Route::get('/payout-runs', [\App\Http\Controllers\Admin\PayoutRunsController::class, 'index'])->name('payout-runs.index');
    Route::get('/audit-logs', [\App\Http\Controllers\Admin\AuditLogsController::class, 'index'])->name('audit-logs.index');
    Route::get('/top', [\App\Http\Controllers\Admin\TopController::class, 'index'])->name('top');
});
