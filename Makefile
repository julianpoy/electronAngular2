APP_NAME=APPNAMEHERE
ELECTRON_VERSION=1.3.3
OUTPUT_DIR=build
PLAT_WINDOWS_32=APPNAMEHERE\ for\ Windows\ 32
PLAT_WINDOWS_64=APPNAMEHERE\ for\ Windows\ 64
PLAT_MAC_64=APPNAMEHERE\ for\ Mac
PLAT_LINUX_32=APPNAMEHERE\ for\ Linux\ 32
PLAT_LINUX_64=APPNAMEHERE\ for\ Linux\ 64

list:
	echo windows, windows-64, mac-64, linux, linux-64, all
clean-apps:
	rm -rf ${OUTPUT_DIR} && mkdir ${OUTPUT_DIR}
windows:
	rm -rf ${OUTPUT_DIR}/${PLAT_WINDOWS_32}
	electron-packager ./dist ${APP_NAME} --platform=win32 --arch=ia32 --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}
	mv ${OUTPUT_DIR}/APPNAMEHERE-win32-ia32 ${OUTPUT_DIR}/${PLAT_WINDOWS_32}
	rm -rf ${OUTPUT_DIR}/${PLAT_WINDOWS_32}/LICENSE
	rm -rf ${OUTPUT_DIR}/${PLAT_WINDOWS_32}/version
	( cd ${OUTPUT_DIR} ; zip -r ./${PLAT_WINDOWS_32}.zip ./${PLAT_WINDOWS_32} )
windows-64:
	rm -rf ${OUTPUT_DIR}/${PLAT_WINDOWS_64}
	electron-packager ./dist ${APP_NAME} --platform=win32 --arch=x64 --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}
	mv ${OUTPUT_DIR}/APPNAMEHERE-win32-x64 ${OUTPUT_DIR}/${PLAT_WINDOWS_64}
	rm -rf ${OUTPUT_DIR}/${PLAT_WINDOWS_64}/LICENSE
	rm -rf ${OUTPUT_DIR}/${PLAT_WINDOWS_64}/version
	( cd ${OUTPUT_DIR} ; zip -r ./${PLAT_WINDOWS_64}.zip ./${PLAT_WINDOWS_64} )
mac-64:
	rm -rf ${OUTPUT_DIR}/${PLAT_MAC_64}
	electron-packager ./dist ${APP_NAME} --platform=darwin --arch=x64 --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}
	mv ${OUTPUT_DIR}/APPNAMEHERE-darwin-x64 ${OUTPUT_DIR}/${PLAT_MAC_64}
	rm -rf ${OUTPUT_DIR}/${PLAT_MAC_64}/LICENSE
	rm -rf ${OUTPUT_DIR}/${PLAT_MAC_64}/version
	( cd ${OUTPUT_DIR} ; zip -r ./${PLAT_MAC_64}.zip ./${PLAT_MAC_64} )
linux:
	rm -rf ${OUTPUT_DIR}/${PLAT_LINUX_32}
	electron-packager ./dist ${APP_NAME} --platform=linux --arch=ia32 --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}
	mv ${OUTPUT_DIR}/APPNAMEHERE-linux-ia32 ${OUTPUT_DIR}/${PLAT_LINUX_32}
	rm -rf ${OUTPUT_DIR}/${PLAT_LINUX_32}/LICENSE
	rm -rf ${OUTPUT_DIR}/${PLAT_LINUX_32}/version
	( cd ${OUTPUT_DIR} ; zip -r ./${PLAT_LINUX_32}.zip ./${PLAT_LINUX_32} )
linux-64:
	rm -rf ${OUTPUT_DIR}/${PLAT_LINUX_64}
	electron-packager ./dist ${APP_NAME} --platform=linux --arch=x64 --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}
	mv ${OUTPUT_DIR}/APPNAMEHERE-linux-x64 ${OUTPUT_DIR}/${PLAT_LINUX_64}
	rm -rf ${OUTPUT_DIR}/${PLAT_LINUX_64}/LICENSE
	rm -rf ${OUTPUT_DIR}/${PLAT_LINUX_64}/version
	( cd ${OUTPUT_DIR} ; zip -r ./${PLAT_LINUX_64}.zip ./${PLAT_LINUX_64} )
all:
	make clean-apps
	gulp
	make windows
	make windows-64
	make mac-64
	make linux
	make linux-64
