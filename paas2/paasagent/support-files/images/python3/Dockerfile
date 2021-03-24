FROM centos:7

RUN yum clean all \
    && yum install -y wget gcc openssl-devel bzip2-devel libffi-devel python-devel python3-devel \
    && yum install -y python3 \
    && wget https://bootstrap.pypa.io/get-pip.py \
    && python3 get-pip.py && rm -rf get-pip.py \
    && wget https://bootstrap.pypa.io/pip/2.7/get-pip.py \
    && python get-pip.py

ADD ./install.sh /tmp

RUN sh /tmp/install.sh
