import React from "react";
import aboutHeroImg from "../../../public/about.jpg";
import { Button } from "../ui/button";
import { useDispatch,useSelector } from "react-redux";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import { RootState } from "@/redux/store";


const AboutHero = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <section className="w-full py-1 bg-white">
      <div className="container mx-auto px-5">
        <div
          className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutHeroImg.src})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-100"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-black">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">
                Let Us Drive The Change <br /> Dhaka Needs!
              </h1>
              <p className="mt-4 text-lg sm:text-xl font-light max-w-2xl mx-auto">
                We’re here to reimagine what’s possible and prove that Bangladesh can build bold,
                beautiful, and extraordinary things — with heart, with purpose, and with people at the center.
              </p>
              <div className="mt-8">
                <Button
                  className="bg-[#EB5C60] text-white font-normal py-2 px-6 rounded-md hover:bg-red-600 transition duration-300"
                  onClick={() => dispatch(changeLoginModalOpen(true))}
                  disabled={user}
                >
                  Register Now!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
