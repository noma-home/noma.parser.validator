import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Account {
  @Prop({ type: [String], default: [], required: true, description: "Посилання на аккаунт" })
  urls: string[];

  @Prop({ type: [String], default: [], description: "Ім'я/Нік користувача на ресурсі" })
  names: string[];

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        const phoneRegex = /^\+380(\s\d{2}){3}\s\d{3}$/;
        return value.every((phoneNumber) => phoneRegex.test(phoneNumber));
      },
      message: "Invalid phone number format. Should be `+380 XX XX XX XXX`",
    },
    description: "Номери телефонів",
  })
  phones: String[];
}
