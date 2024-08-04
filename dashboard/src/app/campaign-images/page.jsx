import { getServerSession } from "next-auth/next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UploadImage from "@/components/gallery/upload-image";
import GalleryImage from "@/components/gallery/gallery-image";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/campaign-images`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["campaign-images"] },
    }
  );

  const images = await response.json();

  if (images.error) {
    throw new Error(images.message);
  }

  return { images, access_token };
}

const CampaignPage = async () => {
  const { images, access_token } = await getData();

  return (
    <div className="space-y-8">
      <Card className="w-full flex justify-between items-center">
        <CardHeader>
          <CardTitle>Campaign Images</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <UploadImage
            access_token={access_token}
            api_endpoint="campaign-images"
            revalidation_tag="campaign-images"
          />
        </CardContent>
      </Card>

      {images.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {images.map((image) => (
            <GalleryImage
              key={image.id}
              image={image}
              access_token={access_token}
              api_endpoint={`campaign-images/${image.id}`}
              revalidation_tag="campaign-images"
            />
          ))}
        </div>
      ) : (
        <p className="text-destructive">No images</p>
      )}
    </div>
  );
};

export default CampaignPage;
