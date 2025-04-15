import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import MenuSection from "@/components/sections/Menu";
import YoutubeEmbed from "@/components/YoutubeEmbed";
import { getGeneral, getHome } from "@/sanity/utils";
import Link from "next/link";

export default function Index({ general, home }: { general: any, home: any }) {
  return (
    <Layout metadata={general}>
      <div 
        className={"fixed top-0 left-0 w-full h-full z-50 flex flex-col justify-center items-center pointer-events-none"}
      >
        <div className={`text-white title uppercase text-2xl md:text-4xl`}>
          Bienvenu À Bord
        </div>
        <svg 
          className={`h-12`} viewBox="0 0 598 108" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M196.016 37.4051C200.281 49.3293 210.799 58.3274 223.663 60.5223V60.5125C221.193 47.5172 209.789 37.6493 196.016 37.4051ZM224.153 65.7918C224.153 71.5606 222.418 76.9283 219.43 81.4089L173.446 47.6522C177.98 42.2526 184.494 38.5412 191.89 37.6235C196.474 51.777 208.917 62.4448 224.128 64.5894C224.143 64.9869 224.153 65.3869 224.153 65.7918ZM194.812 94.3674C181.04 94.1281 169.636 84.2627 167.166 71.2699V71.2527C180.033 73.455 190.548 82.4456 194.812 94.3674ZM166.674 65.9881C166.674 60.2155 168.414 54.8479 171.397 50.3697L217.382 84.1289C212.852 89.5297 206.333 93.2399 198.937 94.1478C194.353 80.0017 181.915 69.3387 166.699 67.1892C166.684 66.7929 166.674 66.3881 166.674 65.9881ZM227.334 65.801C227.334 83.224 213.074 97.3481 195.485 97.3481C177.895 97.3481 163.635 83.224 163.635 65.801C163.635 48.378 177.895 34.2538 195.485 34.2538C213.074 34.2538 227.334 48.378 227.334 65.801ZM178.689 92.6086C172.189 88.6037 167.252 82.3437 164.993 74.9328C165.697 73.7817 166.427 72.5866 167.181 71.3546C168.728 79.3907 173.695 86.2244 180.523 90.3143L178.689 92.6086ZM217.968 43.4544L215.975 45.9485C210.885 40.8002 203.833 37.5635 196.019 37.425C198.509 44.3865 203.13 50.3507 209.105 54.546L206.629 57.6443C199.764 52.7686 194.529 45.7823 191.893 37.6434C190.293 37.8419 188.735 38.1711 187.229 38.6198C188.023 37.3262 188.806 36.0497 189.576 34.7962C191.492 34.4401 193.468 34.2538 195.487 34.2538C204.262 34.2538 212.208 37.7687 217.968 43.4544ZM179.125 51.839L177.341 54.7514L197.257 69.3726L199.384 66.7111L179.125 51.839ZM169.423 67.6896C177.289 69.361 184.292 73.3324 189.678 78.8579L187.182 81.981C181.983 76.4873 175.04 72.6326 167.225 71.2823L169.423 67.6896Z" fill="#00504D"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M179.487 51.2234H182.312C184.66 55.0428 191.089 55.6562 191.089 55.6562C193.448 55.7396 198.197 55.8954 199.402 53.1546C199.854 52.1461 198.48 50.9744 197.831 50.4701C196.153 49.188 194.296 48.0446 192.077 48.3083C191.876 48.3304 191.678 48.3709 191.483 48.4188L191.582 48.4543C192.441 48.8187 193.047 49.6591 193.047 50.6394C193.047 51.9522 191.978 53.0122 190.656 53.0122C189.331 53.0122 188.26 51.9534 188.26 50.6394C188.26 49.6996 188.814 48.885 189.618 48.5022C189.618 48.5022 186.389 47.4434 182.483 49.772H180.376C188.975 35.7363 197.567 21.7472 202.028 14.5792C212.227 -1.81083 225.9 0.0650882 225.9 0.0650882H312.798L310.076 10.5379H228.47C216.528 10.5379 212.147 16.5239 212.147 16.5239L205.197 27.8984L208.543 29.8197C217.315 13.0285 226.503 14.4308 226.503 14.4308H309.061L306.609 23.8607H226.808C226.808 23.8607 223.559 24.084 219.553 28.0493C215.55 32.0146 215.55 33.8488 215.55 33.8488L217.436 34.9347L223.182 27.8996L227.866 31.0454L171.655 101.388L165.251 97.0609L168.797 91.4123L165.647 89.2848L161.784 94.7273L155.484 90.4688C155.484 90.4688 167.352 71.0324 179.487 51.2234ZM178.689 92.6086C172.189 88.6037 167.252 82.3437 164.993 74.9328C165.697 73.7817 166.427 72.5866 167.181 71.3546C168.728 79.3907 173.695 86.2244 180.523 90.3143L178.689 92.6086ZM217.968 43.4544L215.975 45.9485C210.885 40.8002 203.833 37.5635 196.019 37.425C198.509 44.3865 203.13 50.3507 209.105 54.546L206.629 57.6443C199.764 52.7686 194.529 45.7823 191.893 37.6434C190.293 37.8419 188.735 38.1711 187.229 38.6198C188.023 37.3262 188.806 36.0497 189.576 34.7962C191.492 34.4401 193.468 34.2538 195.487 34.2538C204.262 34.2538 212.208 37.7687 217.968 43.4544ZM179.125 51.839L177.341 54.7514L197.257 69.3726L199.384 66.7111L179.125 51.839ZM169.423 67.6896C177.289 69.361 184.292 73.3324 189.678 78.8579L187.182 81.981C181.983 76.4873 175.04 72.6326 167.225 71.2823L169.423 67.6896Z" fill="#00504D"/>
          <path d="M35.5553 34.4896H61.2745L62.7794 97.4232H45.7035L45.8843 84.3653H23.554L16.6201 97.4232H0L35.5553 34.4896ZM31.7254 69.0034L31.578 69.2524H46.0961L46.0701 69.0439L45.4768 44.6238H45.4458L31.7254 69.0034Z" fill="#009035"/>
          <path d="M83.469 34.4896H99.3757L82.3517 97.4232H66.4401L83.469 34.4896Z" fill="#009035"/>
          <path d="M107.936 34.4896H135.312C142.879 34.4896 148.054 35.7889 150.841 38.3838C153.63 40.9787 154.269 45.0765 152.755 50.6773C151.186 56.4719 148.226 61.1439 143.871 64.6958C139.935 67.8918 135.515 69.6684 130.611 70.0278L142.429 97.4244H122.461L114.158 70.764H114.036L106.82 97.4244H90.9128L107.936 34.4896ZM116.457 61.8015H126.887C128.979 61.8015 130.826 61.2003 132.417 59.9943C134.016 58.7846 135.085 57.181 135.63 55.1726C136.112 53.385 135.882 52.0097 134.943 51.0441C134.007 50.0835 132.417 49.6013 130.189 49.6013H119.76L116.457 61.8015Z" fill="#009035"/>
          <path d="M256.023 34.4896H281.753L283.257 97.4232H266.179L266.359 84.3653H244.027L237.093 97.4232H220.473L256.023 34.4896ZM252.196 69.0034L252.051 69.2524H266.574L266.548 69.0439L265.951 44.6238H265.925L252.196 69.0034Z" fill="#009035"/>
          <path d="M287.47 97.4232L304.491 34.4896H347.263L343.174 49.6037H316.32L313.569 59.7514H340.426L336.338 74.8655H309.482L303.38 97.4244L287.47 97.4232Z" fill="#009035"/>
          <path d="M353.445 34.4896H380.822C388.384 34.4896 393.556 35.7889 396.348 38.3838C399.14 40.9787 399.779 45.0765 398.264 50.6773C396.696 56.4719 393.736 61.1439 389.376 64.6958C385.437 67.8918 381.02 69.6684 376.119 70.0278L387.939 97.4244H367.97L359.667 70.764H359.541L352.327 97.4244H336.415L353.445 34.4896ZM361.965 61.8015H372.392C374.486 61.8015 376.336 61.2003 377.927 59.9943C379.524 58.7846 380.593 57.181 381.135 55.1726C381.625 53.385 381.392 52.0097 380.453 51.0441C379.509 50.0835 377.927 49.6013 375.696 49.6013H365.265L361.965 61.8015Z" fill="#009035"/>
          <path d="M409.226 34.4896H425.135L408.104 97.4232H392.2L409.226 34.4896Z" fill="#009035"/>
          <path d="M440.059 107.516L437.625 98.6065C430.904 97.6716 426.236 94.9308 423.627 90.3753C420.391 84.7341 420.298 76.2464 423.332 64.9222C426.231 54.3071 430.779 46.3433 436.991 41.0382C443.189 35.7307 451.076 33.0781 460.637 33.0781C470.817 33.0781 477.475 35.565 480.62 40.545C483.765 45.5299 483.833 53.5857 480.818 64.721L480.765 64.9222C477.731 76.2464 473.033 84.7488 466.68 90.4232C463.027 93.6842 458.808 96.019 454.037 97.4128L457.167 107.515L440.059 107.516ZM445.478 54.0838C442.45 57.1461 440.151 61.5531 438.602 67.3011C437.098 72.8553 437.044 77.1065 438.448 80.0449C439.851 82.9943 442.618 84.4641 446.745 84.4641C450.892 84.4641 454.462 82.9955 457.462 80.0449C460.462 77.1065 462.706 72.8565 464.211 67.3011C465.871 61.1691 466.045 56.6688 464.749 53.793C463.447 50.9221 460.602 49.4817 456.205 49.4817C452.083 49.4829 448.503 51.0215 445.478 54.0838Z" fill="#009035"/>
          <path d="M535.935 73.6496C533.694 82.044 529.877 88.3417 524.502 92.5328C519.116 96.7386 512.189 98.823 503.697 98.823C495.209 98.823 489.414 96.7386 486.322 92.5328C483.225 88.3417 482.799 82.044 485.045 73.6496L495.642 34.4896H511.551L501.221 72.6693C500.32 76.0077 500.436 78.5548 501.588 80.3153C502.73 82.0796 504.835 82.963 507.917 82.963C510.988 82.963 513.577 82.0784 515.673 80.3153C517.773 78.5535 519.277 76.0065 520.178 72.6693L530.508 34.4896H546.528L535.935 73.6496Z" fill="#009035"/>
          <path d="M536.968 97.4232L553.99 34.4896H598L593.911 49.6037H565.814L563.477 58.2423H591.569L589.536 65.7816L587.48 73.354H559.388L556.959 82.3164H585.056L580.972 97.4256H536.968V97.4232Z" fill="#009035"/>
        </svg>
        <Link href="/home" className="pointer-events-auto">
          <button className="text-white text-lg font-bold mt-4">
            Click to enter
          </button>
        </Link>
      </div>
      <YoutubeEmbed />
    </Layout>
  );
}

export const getStaticProps = async (context: any) => {
  const { locale } = context;
  const general = await getGeneral(locale);
  const home = await getHome();

  return {
    props: { general, home },
    revalidate: 60,
  }
}