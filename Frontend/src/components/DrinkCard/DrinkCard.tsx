import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"

export function DrinkCard() {
  const drinkImg = "url"

  return (
    <div>
      <Card>
        <CardMedia
          component="img"
          alt="drink img"
          height="186px"
          width="246px"
          image={drinkImg}
        />
      </Card>
    </div>
  )
}
