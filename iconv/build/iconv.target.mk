# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := iconv
DEFS_Debug := \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-pthread \
	-m64 \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-fno-exceptions \
	-fno-rtti \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-fno-exceptions

INCS_Debug := \
	-I/home/ubuntu/.node-gyp/0.10.33/src \
	-I/home/ubuntu/.node-gyp/0.10.33/deps/uv/include \
	-I/home/ubuntu/.node-gyp/0.10.33/deps/v8/include \
	-I$(srcdir)/node_modules/nan \
	-I$(srcdir)/support

DEFS_Release := \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-pthread \
	-m64 \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-fno-exceptions \
	-fno-rtti \
	-O2 \
	-fno-strict-aliasing \
	-fno-tree-vrp \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-fno-exceptions

INCS_Release := \
	-I/home/ubuntu/.node-gyp/0.10.33/src \
	-I/home/ubuntu/.node-gyp/0.10.33/deps/uv/include \
	-I/home/ubuntu/.node-gyp/0.10.33/deps/v8/include \
	-I$(srcdir)/node_modules/nan \
	-I$(srcdir)/support

OBJS := \
	$(obj).target/$(TARGET)/src/binding.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# Make sure our dependencies are built before any of us.
$(OBJS): | $(builddir)/iconv.a $(obj).target/iconv.a

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS :=

$(obj).target/iconv.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/iconv.node: LIBS := $(LIBS)
$(obj).target/iconv.node: TOOLSET := $(TOOLSET)
$(obj).target/iconv.node: $(OBJS) $(obj).target/iconv.a FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/iconv.node
# Add target alias
.PHONY: iconv
iconv: $(builddir)/iconv.node

# Copy this to the executable output path.
$(builddir)/iconv.node: TOOLSET := $(TOOLSET)
$(builddir)/iconv.node: $(obj).target/iconv.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/iconv.node
# Short alias for building this executable.
.PHONY: iconv.node
iconv.node: $(obj).target/iconv.node $(builddir)/iconv.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/iconv.node

