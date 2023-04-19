<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;



class VerifyEmail extends VerifyEmailBase
{
    use Queueable;
    protected $code;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($code)
    {
        $this->code = $code;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */

    // protected function verificationUrl($notifiable)
    // {
    //     return URL::temporarySignedRoute(
    //         'verification.verify',
    //         Carbon::now()->addMinutes(60),
    //         ['id' => $notifiable->getKey()]
    //     );
    // }

    public function toMail($notifiable)
    {
        // $url = url('/verify-email/' . $this->code);

        return (new MailMessage)
            ->line('Please use the following verification code to verify your email address.')
            ->line($this->code)
            // ->action('Verify Email', $url)
            ->line('If you did not request to verify your email address, please ignore this message.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
