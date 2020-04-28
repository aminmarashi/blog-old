# Compiling for ARM

# ARM architecture

ARM refers to a large group of CPU architectures designed for embedded systems
and low cost computing. There are many variations of ARM instruction code and
unfortunately they are not very compatible with each other.
It's important to identify the target architecture otherwise the built files
may not be compatible with the target machine.

For this document I am going to compile for `arm64` (aka `aarch64` as GCC calls
it). This architecture is used on `AWS` ARM instances which are available for
cheaper price than the AMD64 ones.

In a Debian machine running on an `aarch64` you can see:

```
$ uname -a
Linux hostname 4.9.0-12-arm64 #1 SMP Debian 4.9.210-1 (2020-01-20) aarch64 GNU/Linux
```

And:

```
$ dpkg --print-architecture
arm64
```

As you can see `arm64` and `aarch64` are used almost interchangeably.

There are two ways we can go about building, one is `cross compiling` using
`aarch64-linux-gnu-gcc` which is GCC support for ARM64 architecture.

The other (and less complicated) way is to make the package inside a VM. I will
use `Docker` with `qemu multiarch` which is basically a VM that allows running
Docker images built for other architectures including `aarch64`.

## Building using Docker

The Docker image for `aarch64` is officially deprecated in favor of [`arch64v8`](https://hub.docker.com/r/arm64v8/debian/)
which has support for a broader variants of the architecture.

### Qemu multiarch

First we will need to enable [`qemu-user-static`](https://github.com/multiarch/qemu-user-static)
which allows us to run the Docker image built for ARM.

**Note:** This setup uses `binfmt`, read more: [`binfmt_misc`](https://en.wikipedia.org/wiki/Binfmt_misc)

```
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

This will setup the multi arch files and now we can run Docker images that are
built for different architectures seamlessly.

### Debian for aarch64

After enabling mutliarch, we can simply run the debian image built for ARM:

```
docker run -it arm64v8/debian:stretch
root@3b853bce5181:/#
```

Now we can see the architecture is shown to be ARM:

```
# uname -a
Linux 3b853bce5181 5.3.0-46-generic #38-Ubuntu SMP Fri Mar 27 17:37:05 UTC 2020 aarch64 GNU/Linux
```

```
# dpkg --print-architecture
arm64
```

That's it, we should now be able to download the source code and build it for
`aarch64` inside that container.

### Downloading and building ls

Just for the sake of the demonstration, let's write a simple hello world `C` and
compile it for ARM.

```
cat <<EOF > helloworld.c
#include <stdio.h>
int main() {
   printf("Hello, World!\n");
   return 0;
}
EOF
```

First we will need to install `gcc` to compile our source code:

```
# apt update && apt install gcc file -y
```

Then we can compile our source code:

```
gcc -o helloworld helloworld.c
```

And then run it:

```
# ./helloworld
Hello, World!
```

We can also use the `file` command to tell us about the binary format of the
executable we just built:

```
helloworld: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV) ...
```

Yes, it's clearly built for ARM.

One little trick we can do with GCC is that we can see the assembler code,
therefore we can see how the instruction set looks like:

```
gcc -o helloworld.asm -S helloworld.c
```

Contents of `helloworld.asm` will look like this:

```
	.arch armv8-a
	.file	"helloworld.c"
	.section	.rodata
	.align	3
.LC0:
	.string	"Hello, World!"
	.text
	.align	2
	.global	main
	.type	main, %function
main:
	stp	x29, x30, [sp, -16]!
	add	x29, sp, 0
	adrp	x0, .LC0
	add	x0, x0, :lo12:.LC0
	bl	puts
	mov	w0, 0
	ldp	x29, x30, [sp], 16
	ret
	.size	main, .-main
	.ident	"GCC: (Debian 6.3.0-18+deb9u1) 6.3.0 20170516"
	.section	.note.GNU-stack,"",@progbits
```

### Raspberry Pi

This method can be used to build applications that run on other ARM processors.
For example on Raspberry Pi devices, instead of `aarch64` and `arm64`, you
would expect something similar to `armv7l` and `armhf`.

```
$ uname -a
Linux raspberrypi 4.19.97-v7l+ #1294 SMP Thu Jan 30 13:21:14 GMT 2020 armv7l GNU/Linux
```

```
$ dpkg --print-architecture
armhf
```

