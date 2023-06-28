from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LinkSerializer


class CreateLink(APIView):

    @staticmethod
    def post(request):
        serializer = LinkSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            link = serializer.create(data=serializer.validated_data)
            return Response(LinkSerializer(link).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetLink(APIView):

    @staticmethod
    def get(request):
        serializer = LinkSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            try:
                link = serializer.get(request.data)
            except KeyError as e:
                return Response(e.args, status=status.HTTP_404_NOT_FOUND)

            return Response(link, status=status.HTTP_200_OK)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)