<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class createAccount extends Notification
{
    use Queueable;
    protected $userDetails;


    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(array $userDetails)
    {
        $this->userDetails = $userDetails;
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
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->greeting('Hello!')
            ->line('Your account has been created successfully.')
            ->line('Here are your account details:')
            ->line('Email: ' . $this->userDetails['email'])
            ->line('Password: ' . $this->userDetails['password'])
            ->line('You can now log in to your account.')
            ->line('Thank you for using our application!');
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
