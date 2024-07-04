# Usa una imagen base de Python
FROM python:3.9-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY requirements.txt requirements.txt
COPY . .

# Instalar las dependencias
RUN pip install -r requirements.txt

# Establecer la variable de entorno para el puerto
ENV PORT 8080

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 match_incidents:app
