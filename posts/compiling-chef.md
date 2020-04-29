# Compiling Chef from source

In this blog post we will see how Chef can be built from source. This is useful
when you want to install Chef on a distro or machine which is not supported by
default. Which is true for most ARM processors at the time of writing this.

## Compiling Ruby

**Note:** You can skip this step and go directly to [Compiling Chef](#compiling-chef), if
your distro already has a suitable ruby version. In my case the version was too
old for the Chef build to work.

The [Ruby github page](https://github.com/ruby/ruby#git) is very helpful when it
comes to compiling Ruby from source.

The builing process is as easy as:

```
$ ./configure
$ make
```

### Installation in a destination directory

Now a `make install` will install Ruby in `/usr` directory, but that behavior
can be changed using `DESTDIR` option:

```
$ make install DESTDIR=~/ruby
```

The above command will install the build in `~/ruby`. This is useful if `root`
access is not available, or if the build is meant to be copied to a different
machine.

### Install Ruby globally

After building Ruby, you can install it globally by:

```
sudo cp -r ~/ruby/usr/* /usr
```

## Compiling Chef

You will need `Ruby` and `bundler` to be installed to build Chef. `gem`
comes as a package with the `Ruby`.

### Installing bundler

Make sure `bundler` is installed, if not install it:

```
$ gem install bundler
```

### Downloading the source

Download the specific version of Chef source from [Chef on Github](https://github.com/chef/chef/)
then extract the package.

```
$ wget https://github.com/chef/chef/archive/v15.6.10.tar.gz
$ tar xf v15.6.10.tar.gz
$ cd ~/chef-15.6.10/omnibus # yes, chef is built from the omnibus folder
```

### Installing dependencies

Then install the `gem`s required for building chef locally:

```
$ bundle install --without development --path=.bundle
```

This will install all the dependencies in `.bundle` inside the source folder.

### Building using omnibus

After that start building Chef using `omnibus`:

```
$ bundle exec omnibus build chef -l internal
```

[Omnibus](https://github.com/chef/omnibus) is a packaging solution which makes
sure the packages and all its dependencies are installed in a way that are
easily managable and will not conflict with the existing packages installed on
your system.

Result of the above build is a package specific to your OS, in this case I'm
building Chef for Debian, so there will be a `.deb` file which I will able to
install and uninstall using `dpkg`.

```
$ ls pkg/
chef_15.6.10*.deb
```

### Licensing issues

In my case the build failed because of a licensing error, you can try
ignoring licensing problems for the build, read more about that in [issue #696](https://github.com/chef/omnibus/issues/696).

In my case I fixed that by editing the `omnibus.rb` file (the omnibus config)
and adding these two lines:

```
fatal_licensing_warnings false
fatal_transitive_dependency_licensing_warnings false
```

### Installation of the built deb package

Now we can easily install the package:

```
$ sudo dpkg -i pkg/chef_15.6.10*.deb
```

And verify the desired version is installed:

```
$ chef-client -v
Chef Infra Client: 15.6.10
```
