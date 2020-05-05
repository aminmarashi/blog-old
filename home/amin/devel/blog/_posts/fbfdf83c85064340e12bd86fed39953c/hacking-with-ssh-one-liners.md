---
title: "Hacking with ssh one-liners"
date: 2020-04-28
tags: [hacking]
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

## Running a command

You can pass a command to run on the remote machine, the command will run inside
your default shell and the output is printed to the standard output.

For example you can check the date and time on the server:

```bash{outputLines: 2}
ssh the-internet date
Sat 02 May 2020 11:51:10 PM +08
```

That's a very cool feature, considering that you can connect to both the output
*and* the input of the command.

```bash{outputLines: 2,3}
ssh -t the-internet 'read -pecho: x; echo $x'
echo:hello
hello
```

The `-t` option above is necessary to make the `echo:` prompt appear on the
screen. But even without that option we can still interact with the input of
the `read` command.

## Copying a file over the server

A file can be uploaded to or downloaded from the server easily if we have
access to execute commands.

```bash{outputLines: 4}
echo 'Hello world!' > /tmp/message
cat /tmp/message |ssh the-internet 'cat - > /tmp/remote-message'
ssh the-internet 'cat /tmp/remote-message'
Hello world!
```

## Copying large files fast

With a little help of our friend `gzip` we can even upload/download large
files. We are using a file containing only zeros, and therefore very easy to
zip, but in reality text files are usually easy to zip as well, therefore this
method is actually useful.

```bash{outputLines: 2}
ssh the-internet 'du -Dsh /var/tmp/large'
1.0G	/var/tmp/large
```

Now using `gzip` we can zip the file and send the zipped file to `gunzip` on
our local machine to extract:

```bash{outputLines: 2-5}
time ssh the-internet 'gzip --stdout /var/tmp/large' | gunzip > /var/tmp/large

real	0m19.457s
user	0m5.468s
sys	0m0.715s
```

We have a large file in our local machine now:

```bash{outputLines: 2}
du -sh /var/tmp/large
1.1G	/var/tmp/large
```

## Advanced downloading using pv

Suppose you want to see the progress of the file being downloaded, you can even
control the rate of download. Suppose we have a large file:


```bash{outputLines: 2}
ssh the-internet 'du -Dsh /var/tmp/random'
217M	/var/tmp/random
```

We can see a progress bar when downloading the file (this requires `pv` to be
installed):

```bash{outputLines: 2}
ssh the-internet 'cat /var/tmp/random' | pv -s217m | cat - > random
 103MiB 0:00:14 [7.81MiB/s] [=====>        ] 47% ETA 0:00:15
```

The `-s217m` tells `pv` about the size of the file, if not given the percentage
cannot be calculated.

Or we can limit the download rate to `1 MB` using `-L1m`:

```bash{outputLines: 2}
ssh the-internet 'cat /var/tmp/random' | pv -s217m -L1m | cat - > random
20.0MiB 0:00:20 [1.00MiB/s] [>             ]  9% ETA 0:03:17
```

## Running a command on multiple servers

There are times when we want to run a repatitive command on multiple servers,
we can automate this using ssh. In fact that's how <a
href="https://www.ansible.com/" target="_blank">`Ansible`</a> works.

One use-case might be to change password for a user on multiple machines. Let's
change password for `terminator`:

```bash{outputLines: 2}
echo -e "supersecure\nsupersecure" | ssh the-internet 'sudo passwd terminator'
New password: Retype new password: passwd: password updated successfully
```

We can type in the hosts that will change the `terminator` password:

```bash{outputLines: 3,5}
xargs -IHOST sh -c 'echo "supersecure\nsupersecure" | ssh HOST "sudo passwd terminator"'
the-internet
New password: Retype new password: passwd: password updated successfully
the-skynet
New password: Retype new password: passwd: password updated successfully
```

Or we can automate that and provide the list of hosts:

```text:title=hosts
the-internet
the-skynet
```

```bash{outputLines: 2-3}
xargs -IHOST sh -c 'echo "supersecure\nsupersecure" | ssh HOST "sudo passwd terminator"' < hosts
New password: Retype new password: passwd: password updated successfully
New password: Retype new password: passwd: password updated successfully
```

## Persistent ssh session

Now let's see how we can make use of a combination of ssh and `tmux`. `tmux`
can be used to have an on-going shell in your server that multiple people can
connect to.

To start a session called `mysession`:

```bash{outputLines: 2}
ssh -t the-internet 'tmux new-session -ds mysession'
Connection to the-internet closed.
```

The `-t` tells ssh client to allocate a tty device for using with the tmux
session.

Now anyone with ssh access to that server can connect to the session.

```bash{outputLines: 2,3}
ssh -t the-internet 'tmux attach -t mysession'
[detached (from session mysession)]
Connection to the-internet closed.
```

It is important to detach from the tmux session rather than exit from it if you
want to keep it open for the next time.

You can get a list of clients connected to that session at the moment:

```bash{outputLines: 2,3}
ssh -t the-internet 'tmux list-clients -t mysession'
/dev/pts/1: mysession [150x36 xterm-256color] (utf8)
Connection to the-internet closed.
```
