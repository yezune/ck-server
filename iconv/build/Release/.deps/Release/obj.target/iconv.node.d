cmd_Release/obj.target/iconv.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m64  -Wl,-soname=iconv.node -o Release/obj.target/iconv.node -Wl,--start-group Release/obj.target/iconv/src/binding.o Release/obj.target/iconv.a -Wl,--end-group 
