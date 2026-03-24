export default function IntroducingSmartView() {
    return (
        <section className="w-full my-14">
            <div className="container mx-auto px-5 flex flex-col items-center justify-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 text-center leading-tight">
          Introducing smartVIEW
                </h1>
                <p className="mt-3 text-base md:text-lg font-normal text-[#5A5A5A] text-center max-w-3xl">
          smartVIEW is our proprietary property showcase feature that provides an immersive and
          high-definition viewing experience of rental properties.
                </p>
                <iframe
                    width="100%"
                    height="640"
                    frameBorder="0"
                    allow="xr-spatial-tracking; gyroscope; accelerometer"
                    allowFullScreen
                    scrolling="no"
                    src="https://kuula.co/share/collection/7D9hB?logo=1&info=0&logosize=44&fs=1&vr=1&sd=1&initload=0&autorotate=0.16&autop=5&thumbs=1"
                    className="mt-8 w-full rounded-xl"
                    title="smartVIEW 360 Tour"
                ></iframe>
            </div>
        </section>
    );
}
