interface GoogleMapEmbedProps {
  src: string;
}

const GoogleMapEmbed = ({src}:GoogleMapEmbedProps) => {
  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default GoogleMapEmbed;
