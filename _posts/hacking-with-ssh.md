---
title: "Hacking with ssh"
date: 2020-04-28
tags: [ssh]
---

Cool things you can do with an ssh client, and a Linux machine. Secure Shell is
a protocol to connect to a machine over the network securely. The <a
href="https://www.openssh.com/" target="_blank">`OpenSSH`</a> client is more
than just a secure shell. It has quite a few features that makes it uniquely
useful when connecting two or more machines together.

This post is inspired by <a
href="https://smallstep.com/blog/ssh-tricks-and-tips/" target="_blank">ssh tips
and tricks</a>.

## Logging in without a password

There are other methods of authentication than a password that OpenSSH
supports. One of the most well-known authentication methods is a public key
authentication. You can basically maintain a list of known public keys on the
server and allow passwordless login whenever a client connects using the
corresponding private key.

```bash:title=authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCm7Q3M5QH7aoFL...
```

The above can be copied from an RSA key that usually exists in `~/.ssh` on
Linux machines.

A key can be added to a server using the `ssh-copy-id` command if you already
have another way of connecting to the server.

## Forwarding ssh keys

You can use a server as a `hop` to connect to another server using ssh. If you have public key access to the second server, you can forward your ssh agent to the first ssh session.

This works without having to copy your keys to the `hop` server.

```bash{promptUser: u}{promptHost: hop}
ssh the-internet
u@the-internet: Permission denied (publickey).
```

Connecting to the hop with `-A` forwards the ssh agent:

```bash{outputLines: 2}
ssh -A hop
u@hop:~ $
```

And now we can connect to the server with public key authentication:

```bash{outputLines: 2}{promptUser: u}{promptHost: hop}
ssh the-internet
u@the-internet:~ $
```

## Running a command

You can pass a command to run on the remote machine, the command will run inside
your default shell and the output is printed to the standard output.

For example you can check the date and time on the server:

```bash{outputLines: 2}
ssh the-internet date
Sat 02 May 2020 11:51:10 PM +08
```

A list of cool [ssh one-liners](/hacking-with-ssh-one-liners) you can do
with this feature. Really, the possiblities are endless.

## Redirecting X

Have you ever wanted to run a GUI application on a remote server? Sure there
are ways like VNC, etc. but the experience won't be as good as running the app
on your machine.

If your remote server and your client machine both are running a Linux desktop,
there is a secure and convenient way of running the app in the remote server
using the X server already running on your client machine.

This works because GUI applications can use any X server as their client.

```bash
ssh -XC the-internet chromium-browser
```

This will open a `chromium-browser` on `the-internet` server, and connects it
to your X display. You can interact with the window just like you interact with
any other window in your desktop. You can even copy/paste both ways with that
window.

The `-X` option opens a connection to X11 on your machine from the remote
server which the remote GUI app connects to. Use this option with caution on
servers you absolutely trust, please refer to the `ssh` man page for the
security implications. 

The `-C` is optional, it enables compression on the connection which makes the
interaction faster.

## Create a socks proxy

If you want to use your remote server as a proxy server, you can simply use the
`-D` option, with a port. The ssh client will bind to that port and forward any
connections to that port to your server.

```bash
ssh -Nf -D1080 the-internet
```

The `-D` option will allocate port `1080` on your machine, you can set
`127.0.0.1:1080` as the socks5 proxy in your browser and connect to the server.

The `-Nf` option combination is optional, it basically runs the ssh client in
the background.
